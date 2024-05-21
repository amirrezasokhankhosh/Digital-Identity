./network.sh down
./network.sh up createChannel -c identity
./network.sh deployCC -ccp ../identity/identity-chaincode -c identity -ccn identityCC -ccl javascript