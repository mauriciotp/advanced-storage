// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.9.0;

contract AdvancedStorage {
  uint256[] public ids;

  function add(uint256 id) public {
    ids.push(id);
  }

  function get(uint256 position) public view returns (uint256) {
    return ids[position];
  }

  function getAll() public view returns (uint256[] memory) {
    return ids;
  }

  function length() public view returns (uint256) {
    return ids.length;
  }
}
