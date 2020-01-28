pragma solidity >=0.4.21;
pragma experimental ABIEncoderV2;

contract PropertyFactory {

    struct Property {
        uint256 id;
        string title;
        uint256 price;
        string propertyAddress;
        string urlImage;
        string description;
        uint256 surface;
        string hashDocument;
        bool availability;
    }

    //List of properties..
    Property[] properties;

    // Number of properties made for sale.
    uint256 propertiesCount = 0;

    // Mapping
    mapping (uint => address) public propertiesToOwner;
    mapping (address => uint) public ownerPropertiesCount;

    event NewProperty(Property property);
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    // Check that the property with the id _idProperty is belongs to the user with id _userAdress.
    modifier PropertyOwner(uint256 _idProperty, address _userAdress) {
        require(propertiesToOwner[_idProperty] == _userAdress, "Sender not authorized.");
        _;
    }

    //Check if the property is made for sale.
    modifier PropertyAvailabilty(uint256 _id){
        require(properties[_id].availability, "The property is not available for sale");
        _;
    }

    // Create a new property and make it for sale.
    function createProperty(
        string memory title,
        uint _price,
        string memory _propertyAddress,
        string memory _urlImage,
        string memory _description,
        uint _surface,
        string memory _hashDocument
        )
        public
        payable
    {
        // Add the properties.
        Property memory newProperty = Property(
            propertiesCount,
            title,
            _price,
            _propertyAddress,
            _urlImage,
            _description,
            _surface,
            _hashDocument,
            true
        );

        //Add property to list of properties.
        properties.push(newProperty);

        // Add the owner of the property.
        propertiesToOwner[propertiesCount] = msg.sender;
        ownerPropertiesCount[msg.sender]++;
        propertiesCount++;
        emit NewProperty(newProperty);
    }

    function getOwnerPropertiesCount(address _address) public view returns (uint)
    {
        return  ownerPropertiesCount[_address];
    }

    function getPropertiesCount() public view returns(uint count)
    {
        return properties.length;
    }

    //Set new prise for a exsisting property.
    function setPropertyPrice(uint256 _idProperty, uint256 _newPrice) public PropertyOwner(_idProperty, msg.sender)
    {
        properties[_idProperty].price = _newPrice;
    }

    //Change availability state(true or false).
    function setAvailibilityForSale(uint256 _idProperty, bool availability) public PropertyOwner(_idProperty, msg.sender)
    {
        properties[_idProperty].availability = availability;
    }

    // Change property owner
    function buyProperty(uint _idProperty, address payable receiver)
        public
        payable
        PropertyAvailabilty(_idProperty)
    {
        address oldOwner = propertiesToOwner[_idProperty];
        ownerPropertiesCount[oldOwner] --;
        ownerPropertiesCount[msg.sender] ++;
        propertiesToOwner[_idProperty] = msg.sender;
        receiver.transfer(msg.value);
        emit Transfer(msg.sender, receiver, msg.value);
    }
}