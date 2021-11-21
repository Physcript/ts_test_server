require('dotenv').config()

export default  {
    DATABASE: {
        URL: process.env.MONGO_URL,
        OPTIONS: {
            wtimeoutMS: 5000,
            useUnifiedTopology: true,
            maxPoolSize: 50,
        }
    },
    SERVER: {
        HOST: 'localhost',
        PORT: process.env.port || 1337
    },
    TOKEN: {
        LOGIN: process.env.JWT_SECRET
    }
}
