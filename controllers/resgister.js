

const handlerRegister = (req, res, db, bcrypt) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json("Incorrect form submission");
    }
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
        return trx('users')
        .returning('*')
        .insert({
            name: name, 
            email: loginEmail[0]
        })
        .then(user => {
            res.json(user[0])
        })
        .then(trx.commit)
        .catch(trx.rollback)
        })
    })
    .catch(err => res.status(400).json('Failed to register user'));
    // bcrypt.hash(password, null, null, function(err, hash) {
    //     console.log(hash);
    // });
}

    module.exports = {
        handlerRegister: handlerRegister
    };