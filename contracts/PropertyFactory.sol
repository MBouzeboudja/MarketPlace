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

    Property[] properties;

    uint propertiesCount = 0;

    mapping (uint => address) public propertiesToOwner;
    mapping (address => uint) public ownerPropertiesCount;

    event NewProperty(uint id);
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    modifier PropertyOwner(uint256 _idProperty, address _userAdress) {
        require(propertiesToOwner[_idProperty] == _userAdress, "Sender not authorized.");
        _;
    }


    function createProperty(uint _price, string memory _propertyAddress,
        string memory _urlImage, string memory _description, uint _surface, string memory _hashDocument, bool _availability
        )
        public {

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

    function getOwnerPropertiesCount(address _address) public view returns (uint){
        return  ownerPropertiesCount[_address];
    }

    function getPropertiesCount() public view returns(uint count) {
        return properties.length;
    }

    function getAllProperties() public view returns(Property[] memory){
        return properties;
    }
 
    function setPropertyPrice(uint256 _idProperty, uint256 _newPrice) public PropertyOwner(_idProperty, msg.sender){
        require(properties[_idProperty].availability, "Property is not available for sell or it not exists.");
        properties[_idProperty].price = _newPrice;
    }


    function buyProperty(uint256 _idProperty, address _buyerAdress) public payable PropertyOwner(_idProperty, msg.sender) {
        if(properties[_idProperty].availability == true){
            propertiesToOwner[_idProperty] = _buyerAdress;
            emit Transfer(_buyerAdress, msg.sender, properties[_idProperty].price);
        }
    }
}