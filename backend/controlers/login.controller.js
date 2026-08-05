const pool = require('../config/bd')

const login = async (req, res) => {

  const { email, password } = req.body;

  try {

    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE email = ? AND password = ?',
      [email, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        error: 'Credenciales incorrectas'
      });
    }

    const user = rows[0];

    res.json({
      message: 'Login exitoso',
      user: {
        id: user.id_usuario,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      }
    });

  } catch (error) {
    res.status(500).json({
      error: 'Error en el login'
    });
  }
};

module.exports = { 
    login };