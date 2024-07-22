import { PrismaClient } from '@prisma/client'
// import { formatInTimeZone, fromZonedTime } from 'date-fns-tz'

// const timeZone = 'Asia/Shanghai'

// const prisma = new PrismaClient().$extends({
//   query: {
//     async $allOperations({ model, operation, args, query }) {

//       /* your custom logic for modifying all Prisma Client operations here */
//       if (['update', 'upsert'].includes(operation) && args.data?.deletedAt) {
//         args.data.deletedAt = fromZonedTime(
//           args.data.deletedAt,
//           timeZone,
//         )
//         console.log('args', args)
//       }

//       return query(args)
//     },
//   },
// })
const prisma = new PrismaClient()

export default prisma
