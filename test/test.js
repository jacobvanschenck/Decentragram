// const { is } = require('@babel/types')
// const { assert } = require('chai')
// const { default: Web3 } = require('web3')

const Decentragram = artifacts.require('./Decentragram.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Decentragram', ([deployer, author, tipper]) => {
  let decentragram

  before(async () => {
    decentragram = await Decentragram.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await decentragram.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await decentragram.name()
      assert.equal(name, 'Decentragram')
    })
  })

  describe('images', async () => {
    let result, imageCount, tip
    const hash = 'abc123'

    before(async () => {
      result = await decentragram.uploadImage(hash, 'ImageDescription', {from: author})
      imageCount = await decentragram.imageCount()
  })

    it('creates images', async () => {
      //SUCCESS
      assert.equal(imageCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
      assert.equal(event.hash, hash, 'hash is correct')
      assert.equal(event.description, 'ImageDescription', 'desctiption is correct')
      assert.equal(event.tipAmount, 0, 'tip is correct')
      assert.equal(event.author, author, 'author is correct')

      //Failure: Image must have hash
      await decentragram.uploadImage('','ImageDescription', {from: author}).should.be.rejected
      
      //Failure: Image must have description
      await decentragram.uploadImage(hash,'', {from: author}).should.be.rejected
    })

    it('lists images', async () => {
      const image = await decentragram.images(imageCount)
      assert.equal(image.id.toNumber(), imageCount.toNumber(), 'id is correct')
      assert.equal(image.hash, hash, 'hash is correct')
      assert.equal(image.description, 'ImageDescription', 'desctiption is correct')
      assert.equal(image.tipAmount, 0, 'tip is correct')
      assert.equal(image.author, author, 'author is correct')
    })

    it('allows users to tip images', async () => {
      let oldAuthorBalance
      oldAuthorBalance = new web3.utils.BN(await web3.eth.getBalance(author))

      result = await decentragram.tipImageOwner(imageCount, {from: tipper, value: web3.utils.toWei('1', 'Ether')})
      
      //SUCCESS
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
      assert.equal(event.hash, hash, 'hash is correct')
      assert.equal(event.description, 'ImageDescription', 'desctiption is correct')
      assert.equal(event.tipAmount, 1000000000000000000, 'tip is correct')
      assert.equal(event.author, author, 'author is correct')

      let newAuthorBalance = new web3.utils.BN(await web3.eth.getBalance(author))
      assert(newAuthorBalance, oldAuthorBalance + event.tipAmount, 'authors balance increases by tip amount')

      //FAILURE: Image does not exist
      await decentragram.tipImageOwner(imageCount + 1, {from: tipper, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected
      await decentragram.tipImageOwner(0, {from: tipper, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected
    })
  })
})