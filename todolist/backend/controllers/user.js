import jwt from 'jsonwebtoken';
import {supabase} from '../modules/database.js';

export const createAccessToken = (payload) => {
        // let payload be user email
        return jwt.sign({email: payload}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1s'});
}

export const createRefreshToken = (payload) => {
        // let payload be user email
        return jwt.sign({email: payload}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '7d'});
}

export async function addRefreshToken(refreshToken, userID) {
    const expiry = 24 * 60 * 60 * 1000 * 14

    console.log(`userID: ${userID}`);

    const {data, error} = await supabase
        .from('token')
        .insert([
            {tokenString: refreshToken, 
                issuedAt: new Date(Date.now()), 
                expiresAt: new Date(Date.now() + expiry),
                userID: userID
            }
        ]);
        console.log(`init refresh_token: ${refreshToken}`);
    if (error) {
        console.error('Error inserting refresh token:', error);
        console.log(new Date(Date.now()));
    }
}

export async function getUserID(email) {
    const {data, error} = await supabase
        .from('user')
        .select('*').eq('email', email)
        .single()

    if (error) {
        console.error('Error getting:', error);
        console.log(new Date(Date.now()));
    }
    
    console.log("user: ",data.userID);
    return data.userID;
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validatePassword(password) {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/
    return re.test(password)
}

async function checkPassword(inputEmail, inputPassword) {
    const {data, erorr} = await supabase
        .from('user')
        .select('*').eq('email', inputEmail)
        .single()
    
    if (data.password === inputPassword) {
        return true;
    }

    return false;
}

async function isNewUser(email) {
    const {data, error} = await supabase
        .from('user')
        .select('*').eq('email', email)
        .single();
    
    if (error) {
        if (error.code === 'PGRST116') { // no rows found
            return true;  // email is available
        }
    }
    return false;
}

async function addUser(username, email, password) {
    const {data, error} = await supabase
        .from('user')
        .insert([
            {username: username,
                email: email,
                password: password,
                confirmPassword: password,
                createdAt: new Date(Date.now()),
                lastUpdated: new Date(Date.now())
            }
        ]);
    if (error) {
        console.error('Error inserting user:', error);
        console.log(new Date(Date.now()));
    }
        
} 

export const signUp = async (req, res) => {

    try {
        const {username, email, password, confirmPassword} = req.body;

        // check if all fields are filled
        if (!username || !email || !password || !confirmPassword) {
            return res.status(400).json({"message": "Fill all fields"});
        }

        if (!validatePassword(password) ? res.status(400).json({"message": "Password must be longer than 6 chars and must contain a-z, A-Z, 0-9"}) : true );

        if (!validateEmail(email) ? res.status(400).json({"message": "Invalid Email format, retry."}) : true);

        // check for existing user
        if (!isNewUser(email) ? res.status(400).json({"message": "Email already in use, try again."}) : true);

        if (password != confirmPassword ? res.status(400).json({"message": "Password and Confirm Password do not match."}) : true);
        
        addUser(username, email, password)

        res.status(200).json({"message": "Successfully added user to database!"});


    } catch (error) {
        return res.status(500).json({"message": "Server Error D:"});
    }
}

export const signIn = async (req, res) => {
    const {email, password} = req.body;
    console.log(email);
 
    try {
        // search for email in database 
        if(isNewUser(email) == true) {
            return res.status(400).json({"message": "User does not exist"});
        }

        // see if password matches
        if(!checkPassword(email, password) ? res.status(400).json({"message": "Password does not match"}) : true);

        const access_token = createAccessToken(email);

        const refresh_token = createRefreshToken(email);

        const userID = await getUserID(email);

        await addRefreshToken(refresh_token, userID);
        console.log(`init access_token: ${access_token}`);
        console.log(`init refresh_token: ${refresh_token}`);

        res.cookie("access_token", [access_token, email], {
            httpOnly: true
        })

        res.cookie("refresh_token", [refresh_token, email], {
            httpOnly: true
        })
            
        return res.status(200).json({
            "message": "Sucessful login",
            "email": email
        });
    } catch (error) {
        return res.status(500).json({"message": `${error}`});
    }
};

// redirect to home 
export const signOut = async (req, res) => {
    res.cookie("access_token", " ", {
        httpOnly: true
    })

    res.cookie("refresh_token", " ", {
        httpOnly: true
    })

    return res.status(200).json({"message": "successful logout"})
}
