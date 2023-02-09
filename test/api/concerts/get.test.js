const chai = require('chai');
const chaiHttp = require('chai-http');
const Concert = require('../../../models/concert.model');
const Seat = require('../../../models/seat.model');
chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;
const server = require('../../../server.js');

describe('GET /api/concerts', async () => {
  before(async () => {
    const testConcOne = new Concert({
      _id: '5d9f1110f10a81216cfd4408',
      performer: 'John Doe',
      genre: 'Rock',
      price: 25,
      day: 1,
      image: '/img/uploads/1fsd324fsdg.jpg',
    });
    await testConcOne.save();

    const testConcTwo = new Concert({
      _id: '5d1f1159f81ce8d1ef2bee48',
      performer: 'Amanda Doe',
      genre: 'Pop',
      price: 45,
      day: 2,
      image: '/img/uploads/1fsd324fsdg.jpg',
    });
    await testConcTwo.save();

    const testSeatOne = new Seat({
      _id: '63dAef9776f5c56cbd593e20',
      day: 1,
      seat: 3,
      client: '63dd03a54871f01ff6f6f2e8',
    });
    await testSeatOne.save();

    const testSeatTwo = new Seat({
      _id: '63daEf9776f5c56cbd593e22',
      day: 1,
      seat: 4,
      client: '63dd03a54871f01ff6f6f2e2',
    });
    await testSeatTwo.save();

    const testSeatThree = new Seat({
      _id: '63Daef9776f5c56cbd593e21',
      day: 2,
      seat: 3,
      client: '63dd03a54871f01ff6f6f2e1',
    });
    await testSeatThree.save();
  });

  it('/ should return all concerts', async () => {
    const res = await request(server).get('/api/concerts');
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    expect(res.body.length).to.be.equal(2);
    expect(res.body[0].freeSeats).to.be.equal(48);
  });

  it('/:id should return one concert by :id ', async () => {
    const res = await request(server).get(
      '/api/concerts/5d1f1159f81ce8d1ef2bee48'
    );
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('object');
    expect(res.body).to.not.be.null;
    expect(res.body.freeSeats).to.be.equal(49);
  });

  it('/:id should return message if wrong concert id ', async () => {
    const res = await request(server).get(
      '/api/concerts/5d1f1159f81ce8d1ef2bee41'
    );
    expect(res.status).to.be.equal(404);
    expect(res.body).to.be.an('object');
    expect(res.body).to.not.be.null;
    expect(res.body.message).to.be.equal('Concert not found');
  });

  after(async () => {
    await Concert.deleteMany();
  });
  after(async () => {
    await Seat.deleteMany();
  });
});
