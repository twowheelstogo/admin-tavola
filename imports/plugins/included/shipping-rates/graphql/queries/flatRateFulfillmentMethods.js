import gql from "graphql-tag";

export default gql`
  query flatRateFulfillmentMethods($shopId: ID!, $first: ConnectionLimitInt, $offset: Int) {
    flatRateFulfillmentMethods(shopId: $shopId, first: $first, offset: $offset) {
      nodes {
        _id
        cost
        fulfillmentTypes
        group
        handling
        isEnabled
        label
        name
        rate
        position
        citiesIncludes
        citiesExcludes
        geo {
          coordinates
        }
        apiDistance{
          key
          url
          method
          headers
          body
          args
          path
        }
        destinations {
          _id
          location {
            countries {
              inp
              out
            }
            regions {
              inp
              out
            }
            cities {
              inp
              out
            }
            postals {
              inp
              out
            }
            districts {
              inp
              out
            }
            streets {
              inp
              out
            }
          }
          isLength
          lengths {
            _id
            max
            min
            price
            currency
            rate
            position
          }
          price
          currency
          rate
          isMultiple
          position
        }
        langs
        i18ns {
          field
          isHtml
          content
          langs
        }
      }
    }
  }
`;
