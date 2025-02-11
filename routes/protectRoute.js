const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract token from header

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    req.adminId = decoded.id; // Attach admin ID to the request
    next();
  });
}

// Example of protecting a route
app.get('/admin/dashboard', verifyToken, (req, res) => {
  res.send('Welcome to the Admin Dashboard');
});
