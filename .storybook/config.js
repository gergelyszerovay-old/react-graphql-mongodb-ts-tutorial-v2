import * as React from 'react';
import {addDecorator, configure} from '@storybook/react';
import 'antd/dist/antd.css';
import '../src/components/App.css'

const CenterDecorator = storyFn => <div style={{margin: '25px', maxWidth: '1400px'}}>{storyFn()}</div>;
addDecorator(CenterDecorator);

function loadStories() {
    const req = require.context('../src/components', true, /.stories.tsx$/);
    req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
