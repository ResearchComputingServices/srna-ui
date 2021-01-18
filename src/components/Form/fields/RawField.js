import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';

const RawField = ({ content }) => <Box width='90%'>{content}</Box>;

RawField.propTypes = { content: PropTypes.node.isRequired };

export default RawField;
