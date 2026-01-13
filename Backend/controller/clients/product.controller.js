
const Product = require("../../model/product.model");

module.exports.getMenu = async (req, res) => {
    try {
        // Use getMenu from model which returns flat list with details
        const flatProducts = await Product.getMenu();
        res.json(flatProducts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports.search = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json([]);
        
        const products = await Product.searchByName(q);
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports.getProductDetail = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.getProductDetails(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
}
