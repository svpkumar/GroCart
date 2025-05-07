import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        console.log("No token found in cookies");
        return res.json({ success: false, message: 'Not Authorized' });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET); 
        if(tokenDecode.id){
            req.body.userId = tokenDecode.id;
        }else{
            return res.json({ success: false, message: 'Not Authorized' });
        }
        next();
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}

export default authUser;