import mongoose from 'mongoose';

export const connectMongoDB = ()=> {
  mongoose.connect(process.env.DB_URI).then((data) => {
    console.log(`mongobd connnected with the server ${data.connection.host}`)
})
}
