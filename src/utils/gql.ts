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

export const QUERY_SINGLE_NOTE = gql`  
    query SingleNote($_id: String!) {
      SingleNote(_id: $_id) {
        _id
        title
        text
        tags {
          _id
          name
          userId
        }         
        userId
      }
    }
   `;

export const MUTATION_NEW_NOTE = gql`
    mutation NewNote($title: String!, $text: String!, $tagIds: [String!]!) {
      NewNote(data :{title: $title, text: $text, tagIds: $tagIds}) {
        _id
        title
        text
        tags {
          _id
          name
          userId
        }         
      }
    }  
    `;

export const MUTATION_EDIT_NOTE = gql`
    mutation EditNote($_id: String!, $title: String!, $text: String!, $tagIds: [String!]!) {
      EditNote(data :{_id: $_id, title: $title, text: $text, tagIds: $tagIds}) {
        _id
        title
        text
        tags {
          _id
          name
          userId
        }         
        userId
    }
    }  
    `;
