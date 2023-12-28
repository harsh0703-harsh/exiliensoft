import { User } from "../schema/user.schema.js";
import { verifyGoogleToken } from "../security/user.security.js";

export const protectedGuard = async (req, res, next) => {

    let token = req.headers.authorization;

    if (!token) {

        return res.status(400).send({ err: "unauthorized.." })

    }

    try {

        token =  token.split(" ")[1]

        const valid = await verifyGoogleToken(token, "596773823926-7j8p0t3oou8fnkp7i5cnakpmkq3m8j6b.apps.googleusercontent.com");

        const user = await User.findOne({ email: valid.email, verified: true });

        if (!user) {

            return res.status(400).send({ err: "unauthorized.." })

        } else {


            req.user = user._id;

            next()

        }

    } catch (err) {

        console.log(err);

        return res.status(401).json({ error: 'Unauthorized - Invalid token' });

    }


}