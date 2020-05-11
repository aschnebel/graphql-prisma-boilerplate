import ApolloBoost from 'apollo-boost'

const getTestClient = (jwt = '') => {
  return new ApolloBoost({
    uri: 'http://localhost:4001',
    request(operation) {
      if (jwt) {
        operation.setContext({
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
      }
    },
  })
}

export { getTestClient }
