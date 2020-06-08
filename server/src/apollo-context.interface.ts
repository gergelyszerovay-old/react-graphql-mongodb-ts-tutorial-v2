import express = require('express');

export interface Context {
    res: express.Response;
    jwt: any;
    csrfSecret: string;
    csrfToken: string;
}