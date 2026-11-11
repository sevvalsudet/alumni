// middlewares/logger.js
// 📋 Logger Middleware
// Her HTTP isteğini dinler, tamamlandığında konsola belirtilen formatta log yazar:
// Örnek: time 10:20:30 method POST route /user res. type 201 duration 18ms

const logger = (req, res, next) => {
    const startTime = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - startTime;
        const now = new Date();
        const time = now.toTimeString().split(' ')[0]; // HH:MM:SS formatı
        const method = req.method;
        const route = req.originalUrl || req.url;
        const resType = res.statusCode;

        console.log(`time ${time} method ${method} route ${route} res. type ${resType} duration ${duration}ms`);
    });

    next();
};

module.exports = logger;
