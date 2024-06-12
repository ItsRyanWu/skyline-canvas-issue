import { Client } from '../type/GraphQL'
import { Base } from "./base"
// eslint-disable-next-line
const gql = require('nanographql')

interface GetExtUserProfileOption {
  externalUserId: string
}

export class Service extends Base {

  public getExtUserProfile({ externalUserId }: GetExtUserProfileOption) {
    const query = gql`
        query client ($externalUserId: String!) {
            client(externalUserId: $externalUserId) {
                profile {
                  lastName
                  firstName
                  name
                  province
                  city
                }
                phone {
                  number
                }
                wechat {
                  avatar
                }
            }
        }
    `
    return this.request<Client>(query({ externalUserId }), 'client')
  }

}
