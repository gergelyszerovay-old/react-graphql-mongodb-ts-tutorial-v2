import {gql} from "@apollo/client";

export const QUERY_NOTE_LIST = gql`  
    query Notes($userId: String!) {
      Notes(userId: $userId) {
        _id
        title
        text
        tags {
          _id
          name
        }
      }
    }
    `;

export const QUERY_TAGS = gql`  
    query Tags($userId: String!) {
      Tags(userId: $userId) {
        _id
        name
        userId
      }
    }
    `;

export const MUTATION_LOAD_DEMO_DATA = gql`
    mutation {
      LoadDemoData
    }  
    `;