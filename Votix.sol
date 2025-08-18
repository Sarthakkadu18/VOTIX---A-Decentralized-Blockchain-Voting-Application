// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

/**
 * @title Votix
 * @dev A smart contract for a secure and transparent voting system.
 * The owner of the contract acts as the election administrator.
 */
contract Votix is Ownable {
    // --- STRUCTS ---

    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    // --- STATE VARIABLES ---

    // Mapping from candidate ID to Candidate struct
    mapping(uint256 => Candidate) public candidates;
    uint256 public candidatesCount;

    // Mappings to track voter status
    mapping(address => bool) public isRegistered;
    mapping(address => bool) public hasVoted;

    // Election period timestamps
    uint256 public votingStartTime;
    uint256 public votingEndTime;

    // Election status flags
    bool public votingStarted;
    bool public votingEnded;

    // --- EVENTS ---

    event VoterRegistered(address indexed voter);
    event Voted(address indexed voter, uint256 candidateId);
    event VotingPeriodSet(uint256 startTime, uint256 endTime);

    // --- MODIFIERS ---

    modifier onlyDuringVoting() {
        require(votingStarted && !votingEnded, "Votix: Voting is not active");
        require(block.timestamp >= votingStartTime && block.timestamp <= votingEndTime, "Votix: Not within the voting period");
        _;
    }

    modifier onlyAdmin() {
        require(owner() == msg.sender, "Votix: Caller is not the owner");
        _;
    }

    // --- FUNCTIONS ---

    /**
     * @dev Add a new candidate to the election.
     * @param _name The name of the candidate.
     */
    function addCandidate(string memory _name) external onlyAdmin {
        require(bytes(_name).length > 0, "Votix: Candidate name cannot be empty");
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    /**
     * @dev Register a voter's address, making them eligible to vote.
     * @param _voterAddress The address of the voter to register.
     */
    function registerVoter(address _voterAddress) external onlyAdmin {
        require(_voterAddress != address(0), "Votix: Invalid voter address");
        require(!isRegistered[_voterAddress], "Votix: Voter is already registered");
        isRegistered[_voterAddress] = true;
        emit VoterRegistered(_voterAddress);
    }

    /**
     * @dev Set the duration of the voting period. Can only be set once.
     * @param _durationInMinutes The duration of the election in minutes.
     */
    function setVotingPeriod(uint256 _durationInMinutes) external onlyAdmin {
        require(votingStartTime == 0, "Votix: Voting period already set");
        votingStartTime = block.timestamp;
        votingEndTime = block.timestamp + (_durationInMinutes * 1 minutes);
        emit VotingPeriodSet(votingStartTime, votingEndTime);
    }

    /**
     * @dev Starts the voting process.
     */
    function startVoting() external onlyAdmin {
        require(votingStartTime != 0, "Votix: Voting period not set");
        require(!votingStarted, "Votix: Voting has already started");
        votingStarted = true;
    }

    /**
     * @dev Ends the voting process.
     */
    function endVoting() external onlyAdmin {
        require(votingStarted, "Votix: Voting has not started");
        require(!votingEnded, "Votix: Voting has already ended");
        votingEnded = true;
        votingEndTime = block.timestamp; // End it immediately
    }

    /**
     * @dev Cast a vote for a specific candidate.
     * @param _candidateId The ID of the candidate to vote for.
     */
    function castVote(uint256 _candidateId) external onlyDuringVoting {
        require(isRegistered[msg.sender], "Votix: You are not registered to vote");
        require(!hasVoted[msg.sender], "Votix: You have already voted");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Votix: Invalid candidate ID");

        hasVoted[msg.sender] = true;
        candidates[_candidateId].voteCount++;
        emit Voted(msg.sender, _candidateId);
    }

    /**
     * @dev Get a list of all candidates.
     * @return An array of Candidate structs.
     */
    function getCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory allCandidates = new Candidate[](candidatesCount);
        for (uint i = 0; i < candidatesCount; i++) {
            allCandidates[i] = candidates[i + 1];
        }
        return allCandidates;
    }
}
