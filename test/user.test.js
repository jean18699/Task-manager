const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOneId, userOne, setupDatabase } = require('./fixtures/db');

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
  const response = await request(app).post('/users').send({
        name: 'Jean',
        email: 'jean18699@gmail.com',
        password: 'Ab12345'
    }).expect(201);

    // Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Asertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Jean',
            email: 'jean18699@gmail.com'
        },
        token: user.tokens[0].token
    });

    // Asset that the password stored is not the plain one
    expect(user.password).not.toBe('Ab12345');
});


test('should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200);

    const user = await User.findById(userOne._id);
    // Asset the new token is saved
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('Should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: 'nonexistent@gmail.com',
        password: 'Ab12345'
    }).expect(400);
});

test('Should get profile for user', async ()=>{
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`) //set headers
        .send()
        .expect(200);
})

test('Should not get profile for unauthenticated user', async ()=>{
    await request(app)
        .get('/users/me')
        .send()
        .expect(401);
})

test('Should delete account for user', async()=>{
    await request(app).
        delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200);

    // The user must be null on the database
    const user = await User.findById(userOne._id);
    expect(user).toBeNull();
    
    // The user is erased, so it must bring a 400 status when trying to log
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(400);
});

test('Should upload avatar image', async()=>{
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'test/fixtures/Boro_29.jpg')
        .expect(200);

    const user = await User.findById(userOne._id);
    expect(user.avatar).toEqual(expect.any(Buffer))
});

test('Should update valid user fields', async ()=>{
    await request(app)
        .patch('/users/me')
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: "jean edited"
        })
        .expect(200);

    const user = await User.findById(userOne._id);
    expect(user.name).toBe('jean edited')

});

test('Should not update invalid user fields', async ()=>{
    await request(app)
        .patch('/users/me')
        .set(`Authorization`, `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'A location'
        })
        .expect(400);
});