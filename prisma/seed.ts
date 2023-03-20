// import { db } from '../src/db.server';

// type User = {
//     firstName: string;
//     lastName: string;
//     password: string;
//     email: string;
//     phoneNSN: string,
//     phoneNumber: string;
//     id: string;
// }

// type Country = {
//     name: string;
//     id: string;
// }

// type Province = {
//     name: string;
//     id: number;
// }

// type District = {
//     name: string;
//     id: number;
// }

// type Address = {
//     type: number;
//     name: string;
//     description: string;
//     postalCode: string;
// }

// async function seed() {
//     await Promise.all(
//         getUsers().map((user) => {
//             return db.user.create({
//                 data: {
//                     firstName: user.firstName,
//                     lastName: user.lastName,
//                     email: user.email,
//                     password: user.password,
//                     phoneNSN: user.phoneNSN,
//                     phoneNumber: user.phoneNumber,
//                     id: user.id
//                 }
//             })
//         })
//     )

//     await Promise.all(
//         getCountries().map((country) => {
//             const { name, id } = country;
//             return db.country.create({
//                 data: {
//                     name,
//                     id
//                 }
//             })
//         })
//     )

//     await Promise.all(
//         getProvinces().map((province) => {
//             const { name } = province;
//             return db.province.create({
//                 data: {
//                     name,
//                     countryId: 'TR'
//                 }
//             })
//         })
//     )

//     await Promise.all(
//         getDistricts().map((district) => {
//             const { name } = district;
//             return db.district.create({
//                 data: {
//                     name,
//                     provinceId: 1
//                 }
//             })
//         })
//     )

//     await Promise.all(
//         getAddresses().map((address) => {
//             const { name, type, description, postalCode } = address;
//             return db.address.create({
//                 data: {
//                     name,
//                     type,
//                     description,
//                     postalCode,
//                     countryId: 'TR',
//                     provinceId: 1,
//                     districtId: 1,
//                     userId: '928948e6-c3d4-11ed-afa1-0242ac120002'
//                 }
//             })
//         })
//     )
// }

// seed();
// // .catch(e => {
// //     console.log(e);
// //     process.exit(1)
// // }).finally(() => {
// //     db.$disconnect();
// // });

// function getUsers(): Array<User> {
//     return [
//         {
//             firstName: 'Sercan',
//             lastName: 'Karakuyu',
//             email: 'sercankarakuyu@gmail.com',
//             phoneNSN: '+90',
//             phoneNumber: '5466010150',
//             password: 'example',
//             id: '928948e6-c3d4-11ed-afa1-0242ac120002'
//         },
//         {
//             firstName: 'Ahmet Can',
//             lastName: 'Küçükkör',
//             email: 'ack@gmail.com',
//             phoneNSN: '+90',
//             phoneNumber: '5366329023',
//             password: 'example',
//             id: '92894c74-c3d4-11ed-afa1-0242ac120002'
//         },
//         {
//             firstName: 'Can',
//             lastName: 'Özgen',
//             email: 'canozgen@gmail.com',
//             phoneNSN: '+90',
//             phoneNumber: '5457447332',
//             password: 'example',
//             id: '92894e04-c3d4-11ed-afa1-0242ac120002'
//         }
//     ]
// }

// function getCountries(): Array<Country> {
//     return [
//         {
//             name: 'Türkiye',
//             id: 'TR'
//         },
//         {
//             name: 'Almanya',
//             id: 'DE'
//         },
//         {
//             name: 'Hollanda',
//             id: 'NL'
//         }
//     ]
// }

// function getProvinces(): Array<Province> {
//     return [
//         {
//             name: 'Konya',
//             id: 1
//         },
//         {
//             name: 'İzmir',
//             id: 2
//         },
//         {
//             name: 'İstanbul',
//             id: 3
//         }
//     ]
// }

// function getDistricts(): Array<District> {
//     return [
//         {
//             name: 'Meram',
//             id: 1
//         },
//         {
//             name: 'Selçuklu',
//             id: 2
//         },
//         {
//             name: 'Karatay',
//             id: 3
//         }
//     ]
// }

// function getAddresses(): Array<Address> {
//     return [
//         {
//             name: 'Ev',
//             type: 1,
//             description: 'Ev adresim',
//             postalCode: '42000'
//         },
//         {
//             name: 'İş',
//             type: 1,
//             description: 'İş adresim',
//             postalCode: '35000'
//         },
//         {
//             name: 'bişey',
//             type: 1,
//             description: 'Bi yer',
//             postalCode: '34000'
//         }
//     ]
// }