pragma solidity >=0.4.21;
pragma experimental ABIEncoderV2;


contract PropertyFactory {

    struct Property {
        uint id;
        uint256 price;
        string propertyAddress;
        string urlImage;
        string description;
        uint surface;
        string hashDocument;
        bool availability;
    }

    //List of properties..
    Property[] properties;

    // Number of properties made for sale.
    uint propertiesCount = 0;

    // Mapping
    mapping (uint => address) public propertiesToOwner;
    mapping (address => uint) public ownerPropertiesCount;

    event NewProperty(uint id);
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
        uint _price,
        string memory _propertyAddress,
        string memory _urlImage,
        string memory _description,
        uint _surface,
        string memory _hashDocument,
        bool _availability
        )
        public
    {
        // Add the properties.
        Property memory newProperty = Property(
            propertiesCount,
            _price,
            _propertyAddress,
            _urlImage,
            _description,
            _surface,
            _hashDocument,
            _availability
        );

        //Add property to list of properties.
        properties.push(newProperty);

        // Add the owner of the property.
        propertiesToOwner[propertiesCount] = msg.sender;
        ownerPropertiesCount[msg.sender]++;
        propertiesCount ++;
        emit NewProperty(propertiesCount - 1);
    }

    function getOwnerPropertiesCount(address _address) public view returns (uint)
    {
        return  ownerPropertiesCount[_address];
    }

    function getPropertiesCount() public view returns(uint count)
    {
        return properties.length;
    }

    function getAllProperties() public view returns(Property[] memory)
    {
        return properties;
    }
 
    //Set new prise for a exsisting property.
    function setPropertyPrice(uint256 _idProperty, uint256 _newPrice) public PropertyOwner(_idProperty, msg.sender)
    {
        require(properties[_idProperty].availability, "Property is not available for sell or it not exists.");
        properties[_idProperty].price = _newPrice;
    }

    //Change availability state(true or false).
    function setAvailibilityForSale(uint256 _idProperty, bool availability) public PropertyOwner(_idProperty, msg.sender)
    {
        properties[_idProperty].availability = availability;
    }

    // By a existing property.
    function buyProperty(uint256 _idProperty, address _buyerAdress)
        public
        payable
        PropertyAvailabilty(_idProperty)
    {
        address oldOwner = propertiesToOwner[_idProperty];
        ownerPropertiesCount[oldOwner] --;
        ownerPropertiesCount[_buyerAdress] ++;
        propertiesToOwner[_idProperty] = _buyerAdress;
        emit Transfer(_buyerAdress, oldOwner, properties[_idProperty].price);
    }
}