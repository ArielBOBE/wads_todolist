import jwt from 'jsonwebtoken';
import { supabase } from '../modules/database.js';
import { createAccessToken, createRefreshToken, getUserID, addRefreshToken } from '../controllers/user.js';


// fetch refresh token and equate
const fetchRefresh = async (refToken) => {
    const {data, error} = await supabase
        .from('token')
        .select('*').eq('tokenString', refToken)
        .single()
    
        if (error) { // no rows found
            if (error.code == 'PGRST116') {
                return false;
            };  // refresh token does not exist
        }
    return new Date(data.expiresAt).getTime();
}

const isExpired = (date) => {
    const expiry = date;

    if (expiry <= Date.now()) {
        return true;
    }
    return false;
}

const invalidateRefresh = async (refToken) => {
    const {data, error} = await supabase
        .from('token')
        .update({expiresAt: new Date(Date.now())}).eq('tokenString', refToken)
        
        if (error) { // no rows found
            if (error.code == 'PGRST116') {
                return false;
            };  // refresh token does not exist
        }
}

export const auth = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    console.log(token);

    if(!token) {
        console.log("Skipped!");
        return res.status(400).json({"message": "please re-enter your credentials in the sign in page"})
    }

    console.log("Hello World",req.cookies);
    const refresh_token = req.cookies["refresh_token"][0]
    const hasToken = await fetchRefresh(refresh_token);
    
    // validate access token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, email) => {
        // if access token is expired, check refresh token validity
        if (err && err.name === "TokenExpiredError") {
            // check refresh token existence
            if (hasToken == false) {
                // redirect to home
                return res.status(401).json({"message": "Refresh token does not exist."})
            } else { // else there is a refresh token, check its expiry
                const expiryStatus = isExpired(hasToken);
                if (expiryStatus) {
                    res.status(400).json({"message": "Invalid token."})
                }
                // only in effect if: a valid, albeit expired, access token
                // AND a completely valid refresh token
                next();
            }
        // any other error (invalid token)
        } else if (err) {
            // redirect to home
            res.status(403).json({"message": "Forbidden access."})
        // otherwise, token is valid and may sign in
        } else {
            next()
        }
    })
};

export const issueToken = async (req, res, next) => {
    const email = req.cookies["refresh_token"][1]
    const old_refresh_token = req.cookies["refresh_token"][0]

    await invalidateRefresh(old_refresh_token);

    const access_token = createAccessToken(email);
    const refresh_token = createRefreshToken(email);

    res.cookie("access_token", [access_token, email], {
        httpOnly: true
    })

    res.cookie("refresh_token", [refresh_token, email], {
        httpOnly: true
    })

    const uID = await getUserID(email)

    await addRefreshToken(refresh_token, uID);

    next();
}

export const confirm = async (req, res) => {
    return res.status(200).json({"message": "Sign in confirmed"});
}