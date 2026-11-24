import express from 'express';

const app = express();
const PORT = 8000;

app.get('/', (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Hello From the Home Page"
    });
});

app.get('/about', (req, res) => {
    try {
        const name = req.query.name;

        if (name) {
            return res.status(200).json({
                success: true,
                message: `Hello ${name}`
            });
        }

        return res.status(200).json({
            success: true,
            message: "Hello Guest"
        })
    } catch (error) {
    console.error(error);

    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
}
});

app.get('/error', (req, res) => {
    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    });
});

app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
});