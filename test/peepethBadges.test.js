const { BN, constants, expectEvent, shouldFail } = require('openzeppelin-test-helpers');
const PeepethBadges = artifacts.require('PeepethBadges')

contract('PeepethBadges', function([minter, anotherAccount]) {
  let horses
  const name = "Peepeth Badges";
  const symbol = "PB";
  const baseTokenUri = "https://peepeth.com/badges/api/badge/";
  const badgeCount = 16

  beforeEach(async function() {
    peepethBadges = await PeepethBadges.new({ from: minter })
  });

  describe('token details', function() {
    it('has details', async function() {
      const _name = await peepethBadges.name();
      assert.equal(name, _name);
      const _symbol = await peepethBadges.symbol();
      assert.equal(symbol, _symbol);
      const _totalSupply = await peepethBadges.totalSupply();
      assert.equal(0, _totalSupply);
    })
  });

  describe('token minting', function() {
    it('mint a token', async function() {
      await peepethBadges.mint(anotherAccount, new BN(0));
      const _totalSupply = await peepethBadges.totalSupply();
      assert.equal(1, _totalSupply);
      const minterBalance = await peepethBadges.balanceOf(minter);
      assert.equal(0, minterBalance);
      anotherAccountBalance = await peepethBadges.balanceOf(anotherAccount);
      assert.equal(1, anotherAccountBalance);
      const _owner = await peepethBadges.ownerOf(new BN(1));
      assert.equal(anotherAccount, _owner);
      const _tokenUri = await peepethBadges.tokenURI(new BN(1));
      assert.equal(`${baseTokenUri}1`, _tokenUri);
      const _tokenbadge = await peepethBadges.tokenBadge(new BN(1));
      _tokenbadge.should.be.bignumber.equal(new BN(0));
    });

    it('mint multiple tokens', async function() {
      for (var i=0; i < badgeCount; i++) {
        await peepethBadges.mint(anotherAccount, new BN(i + 1));
      }
      
      const _totalSupply = await peepethBadges.totalSupply();
      assert.equal(badgeCount, _totalSupply);
      const minterBalance = await peepethBadges.balanceOf(minter);
      assert.equal(0, minterBalance);
      anotherAccountBalance = await peepethBadges.balanceOf(anotherAccount);
      assert.equal(badgeCount, anotherAccountBalance);

      var _owner;
      var _tokenUri;
      var _tokenbadge;
      var _tokenId;
      for (var i=0; i < badgeCount; i++) {
        _tokenId = new BN(i + 1);
        _owner = await peepethBadges.ownerOf(_tokenId);
        assert.equal(anotherAccount, _owner);
        _tokenUri = await peepethBadges.tokenURI(_tokenId);
        assert.equal(`${baseTokenUri}${i + 1}`, _tokenUri);
        _tokenbadge = await peepethBadges.tokenBadge(_tokenId);
        _tokenbadge.should.be.bignumber.equal(new BN(i + 1));
      }
    });
    
    it('non-minter cannot mint a token', async function() {
      await shouldFail.reverting(peepethBadges.mint(anotherAccount, new BN(0), { from: anotherAccount }));
    })
  });
})