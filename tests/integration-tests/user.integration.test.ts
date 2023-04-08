import { db } from '../../src/db.server';
import express from 'express';
import request from 'supertest';
import IntegrationHelpers from '../helpers/Integration-helpers';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { env } from 'process';
import { randomUUID } from 'crypto';
import { ICreateUserDto } from '../../src/components/user/user.types';

describe('users endpoints', () => {
    let app: express.Application;
    let testToken: string;
    const wrongToken: string = jwt.sign({ userId: 'wrongToken' }, env.JWT_SECRET, {
        expiresIn: '2d',
    });
    const route = '/api/users/'
    let testId: string;

    beforeAll(async () => {
        app = await IntegrationHelpers.getApp();
        const testUser = await db.user.findUnique({
            where: {
                email: 'test@test.com'
            }
        });
        if (testUser) {
            await db.user.delete({
                where: {
                    email: 'test@test.com',
                }
            })
        }
    });

    afterAll(async () => {
        db.$disconnect();
    });

    // START OF SIGN-UP USER
    test('sign up/create a user', async () => {
        const createUserDto: ICreateUserDto = {
            firstName: 'Test',
            lastName: 'Test',
            phoneNSN: '+90',
            phoneNumber: '11122233344',
            email: 'test@test.com',
            password: 'password!'
        }

        const response = await request(app).post(route + 'signup')
            .send(createUserDto)
            .expect(201);

        const body = response.body;
        testId = body.user.id;

        expect(jwt.verify(body.token, env.JWT_SECRET).userId).toBe(body.user.id);
        expect(typeof body.user.id === typeof randomUUID()).toBeTruthy();

        const createdUser = await db.user.findUnique({
            where: {
                email: createUserDto.email,
            },
        });

        expect(createdUser).toBeTruthy();
        expect(createdUser!.firstName).toBe(createUserDto.firstName);
        expect(createdUser!.lastName).toBe(createUserDto.lastName);
        expect(createdUser!.email).toBe(createUserDto.email);
    });

    test('should return 400 if user already exists', async () => {
        const userData: ICreateUserDto = {
            firstName: 'Test',
            lastName: 'Test',
            phoneNSN: '+90',
            phoneNumber: '11122233344',
            email: 'test@test.com',
            password: 'qqqWWWeee1'
        };

        await request(app).post(route + 'signup').send(userData).expect(400);
    });

    test('should return 400 if password is not strong enough', async () => {
        const userData: ICreateUserDto = {
            firstName: 'Test',
            lastName: 'Test',
            phoneNSN: '+90',
            phoneNumber: '11122233344',
            email: 'test@test.com',
            password: 'WWWWWWWWW'
        };

        await request(app).post(route + 'signup').send(userData).expect(400);
    })

    test('should return 400 if email is not valid', async () => {
        const userData: ICreateUserDto = {
            firstName: 'Test',
            lastName: 'Test',
            phoneNSN: '+90',
            phoneNumber: '11122233344',
            email: 'test',
            password: 'WWWWWWWWW'
        };

        await request(app).post(route + 'signup').send(userData).expect(400);
    })

    test('should return 400 if credentials are missed', async () => {
        const userDataList = [
            {
                lastName: 'Test2',
                phoneNSN: '+90',
                phoneNumber: '11122233344',
                email: 'test2@test2.com',
                password: 'qqqWWWeee1',
            },
            {
                firstName: 'Test2',
                phoneNSN: '+90',
                phoneNumber: '11122233344',
                email: 'test2@test2.com',
                password: 'qqqWWWeee1',
            },
            {
                firstName: 'Test2',
                lastName: 'Test2',
                phoneNumber: '11122233344',
                email: 'test2@test2.com',
                password: 'qqqWWWeee1',
            },
            {
                firstName: 'Test2',
                lastName: 'Test2',
                phoneNSN: '+90',
                email: 'test2@test2.com',
                password: 'qqqWWWeee1',
            },
        ];

        for (const userData of userDataList) {
            await request(app).post(route + 'signup').send(userData).expect(400);
        }
    });
    // END OF SIGN-UP USER

    // START OF LOGIN USER
    test('returns 200 and a JWT token when valid credentials are provided', async () => {
        const response = await request(app)
            .post(route + 'login')
            .send({
                email: 'test@test.com',
                password: 'password!',
            })
            .expect(200);

        expect(response.body).toHaveProperty('token');
        testToken = response.body.token;
        expect(() => jwt.verify(testToken, process.env.JWT_SECRET)).not.toThrow();
    });

    test('returns 400 when invalid credentials are provided', async () => {
        const response = await request(app)
            .post(route + 'login')
            .send({
                email: 'test@test.com',
                password: 'incorrectpassword',
            })
            .expect(400);

        await request(app)
            .post(route + 'login')
            .send({
                email: 'testt@testt.com',
                password: 'incorrectpassword',
            })
            .expect(400);

        expect(response.body).not.toHaveProperty('token');
    });
    // END OF LOGIN USER

    // GET SIGNED IN USER
    test('returns 200 and the user which signed in', async () => {
        const response = await request(app)
            .get(route + 'me')
            .set('Authorization', `Bearer ${testToken}`)
            .send()
            .expect(200);

        expect(response.body.email).toBe('test@test.com');
        expect(response.body.id).toBe(testId);
    })

    test('returns 404 not found', async () => {
        await request(app)
            .get(route + 'me')
            .set('Authorization', `Bearer ${wrongToken}`)
            .send()
            .expect(401);
    })

    test('returns 401 unauthorized', async () => {
        await request(app)
            .get(route + 'me')
            .send()
            .expect(401);
    })
    // END OF SIGNED IN USER

    // START OF GET A USER BY ID
    test('returns 200 and the user which owns the sent id', async () => {
        await request(app)
            .get(route + testId)
            .set('Authorization', `Bearer ${testToken}`)
            .send()
            .expect(200);
    })

    test('returns 401 unauthorized', async () => {
        await request(app)
            .get(route + testId)
            .send()
            .expect(401);
    })
    //END OF GET A USER BY ID

    // START OF GET USER LIST
    test('returns 200 and the user list', async () => {
        await request(app)
            .get(route)
            .send()
            .expect(200);
    })
    // END OF GET USER LIST

    // START OF UPLOADING PROFILE PICTURE
    test('returns 200 after uploaded pp', async () => {
        const response = await request(app)
            .post(route + 'avatar')
            .set('Authorization', `Bearer ${testToken}`)
            .set('Content-Type', 'multipart/form-data')
            .attach('avatar', fs.readFileSync(path.resolve(__dirname, '../helpers/testDocs/test.jpeg')), { filename: 'test.jpeg' });

        expect(response.status).toBe(200);
        const uploadedFilePath = path.resolve(__dirname, '../..', 'uploads/profile-pictures');
        console.log(uploadedFilePath);
        const file = fs.readdirSync(uploadedFilePath).filter((file) => file.includes(testId))[0]
        expect(fs.existsSync(path.join(uploadedFilePath, file))).toBe(true);

        fs.unlinkSync(path.join(uploadedFilePath, file));
    })

    test('returns 401 if unauthorized while uploading picture', async () => {
        await request(app)
            .post(route + 'avatar')
            .set('Content-Type', 'multipart/form-data')
            .attach('avatar', fs.readFileSync(path.resolve(__dirname, '../helpers/testDocs/test.jpeg')), { filename: 'test.jpeg' })
            .expect(401);
    })

    test('returns 400 upload unexpected file type', async () => {
        await request(app)
            .post(route + 'avatar')
            .set('Content-Type', 'multipart/form-data')
            .set('Authorization', `Bearer ${testToken}`)
            .attach('avatar', fs.readFileSync(path.resolve(__dirname, '../helpers/testDocs/testText.txt')), { filename: 'testText.txt' })
            .expect(400);
    })

    test('returns 400 upload picture size more than 1mb', async () => {
        await request(app)
            .post(route + 'avatar')
            .set('Content-Type', 'multipart/form-data')
            .set('Authorization', `Bearer ${testToken}`)
            .attach('avatar', fs.readFileSync(path.resolve(__dirname, '../helpers/testDocs/moreThan1mb.jpg')), { filename: 'moreThan1mb.jpg' })
            .expect(400);
    })
    // END OF UPLOADING PROFILE PICTURE
});