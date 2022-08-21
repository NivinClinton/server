import designCrewUser from "../model/designCrewUser.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'


dotenv.config()


export const register = async (req, res, next) => {

    const { name, email, phone, password } = req.body;

    if (!(name && email && phone && password)) {
        return res.status(400).send("All input is required");
    }


    let existingUser;

    try {
        existingUser = await designCrewUser.findOne({ email });
    } catch (err) {
        return console.log(err);
    }

    if (existingUser) {
        return res.status(400).json("User Already Found")
    }
    const hashedPassword = bcrypt.hashSync(password);
    const userDetails = new designCrewUser({
        name,
        email: email.toLowerCase(),
        phone,
        password: hashedPassword
    })

    try {
        await userDetails.save();
    } catch (err) {
        return console.log(err);
    }

    const token = jwt.sign(
        { user_id: userDetails._id, email },
        process.env.TOKEN_KEY,
        {
            expiresIn: "2h",
        }
    );
   

    return res.json({data: userDetails, token })
}

export const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!(email && password)) {
        return res.status(400).send("All input is required");
    }
    let existingUser;
    try {
        existingUser = await designCrewUser.findOne({ email });

    } catch (err) {
        return console.log(err);
    }

    if (!existingUser) {
        return res.status(201).send({ message: "User not found" })
    }

    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    if (!isPasswordCorrect || !existingUser) {
        return res.status(400).json(errorRes("Invalid Creditionals"));
    }

    if (existingUser && isPasswordCorrect) {
        const token = jwt.sign(
            { user_id: existingUser._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            }
        );

        // save user token
      
        return res.status(200).json(successRes("login successful", { data: existingUser, token }));
    }
    return res.status(400).json(errorRes("Invalid Creditionals"));
}