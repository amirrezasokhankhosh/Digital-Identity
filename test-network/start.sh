./network.sh down
./network.sh up createChannel -c entity
./network.sh deployCC -ccp ../entity/entity-chaincode -c entity -ccn entityCC -ccl javascript