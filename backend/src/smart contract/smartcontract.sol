// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SupplierRegistry {

    // Struct to store supplier details
    struct Supplier {
        string name;
        string registrationNumber;
        string email;
        bool isVerified;
    }

    // Mapping to store suppliers by their Ethereum address
    mapping(address => Supplier) public suppliers;

    // Event for logging new supplier registration
    event SupplierRegistered(address indexed supplierAddress, string name);

    // Event for logging supplier verification
    event SupplierVerified(address indexed supplierAddress, string name);

    // Function to register a supplier
    function registerSupplier(
        string memory _name, 
        string memory _registrationNumber, 
        string memory _email
    ) public {
        // Check if the supplier is already registered
        require(bytes(suppliers[msg.sender].name).length == 0, "Supplier already registered");

        // Register the supplier with their details
        suppliers[msg.sender] = Supplier({
            name: _name,
            registrationNumber: _registrationNumber,
            email: _email,
            isVerified: false
        });

        emit SupplierRegistered(msg.sender, _name);
    }

    // Function to verify a supplier (can be restricted to admin if needed)
    function verifySupplier(address _supplierAddress) public {
        // Check if the supplier exists
        require(bytes(suppliers[_supplierAddress].name).length != 0, "Supplier does not exist");

        // Mark the supplier as verified
        suppliers[_supplierAddress].isVerified = true;

        emit SupplierVerified(_supplierAddress, suppliers[_supplierAddress].name);
    }

    // Function to check if a supplier is verified
    function isSupplierVerified(address _supplierAddress) public view returns (bool) {
        return suppliers[_supplierAddress].isVerified;
    }
}
