"use strict";

const crypto = require("crypto");

// The Power of a Smile
// by Tupac Shakur
const Poem = [
  "The power of a gun can kill",
  "and the power of fire can burn",
  "the power of wind can chill",
  "and the power of a mind can learn",
  "the power of anger can rage",
  "inside until it tears u apart",
  "but the power of a smile",
  "especially yours can heal a frozen heart",
];

const GenesisHash = '000000';
const Blockchain = {
  blocks: [],
};

// Genesis block
Blockchain.blocks.push({
  data: '',
  hash: GenesisHash,
  index: 0,
  timestamp: Date.now(),
});

// Insert each line into blockchain
for (const line of Poem) {
  const block = createBlock(line);
  Blockchain.blocks.push(block);
}

function createBlock(data) {
  const currentIndex = Blockchain.blocks.length;
  const lastBlock = Blockchain.blocks[currentIndex - 1];

  const block = {
    data,
    index: currentIndex,
    prevHash: lastBlock.hash,
    timestamp: Date.now(),
  };
  block.hash = generateBlockHash(block);

  return block;
}

function generateBlockHash(block) {
  const blockStr = JSON.stringify({
    data: block.data,
    index: block.index,
    prevHash: block.prevHash,
    timestamp: block.timestamp,
  });
  return crypto.createHash("sha256").update(blockStr).digest("hex");
}

function verifyChain() {
  let prevHash = null;
  for (const block of Blockchain.blocks) {
    // Validate hash of previous block, with this the chain is validated
    if (prevHash && block.prevHash !== prevHash) {
      return false;
    }

    // Validate block
    if (!verifyBlock(block)) {
      return false;
    }
    prevHash = block.hash;
  }
  return true;
}

function verifyBlock(currentBlock) {
  // Validate genesis block
  if (currentBlock.index === 0 && currentBlock.hash !== GenesisHash) {
    return false;
  }

  // Validate rest of the blocks
  if (currentBlock.index > 0) {
    const blockHash = generateBlockHash(currentBlock);
    if (currentBlock.hash !== blockHash) {
      return false;
    }
  }

  return true;
}

console.log(`Blockchain is valid: ${verifyChain(Blockchain)}`);
