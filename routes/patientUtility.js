// Authentication middleware
function unLoggedIn (req, res, next) {
// If user is not authenticated via passport, redirect to login page
    if (req.isAuthenticated()) {
        return res.redirect('/patient/dashboard')
    }
    // Otherwise, proceed to next middleware function
    return next()
}
function isLoggedIn (req, res, next) {
    // If user is not authenticated via passport, redirect to login page
        if (req.isAuthenticated()) {
            return next()
        }
        // Otherwise, proceed to next middleware function
        res.redirect('/')
    }

module.exports = {
    isLoggedIn,
    unLoggedIn
}
