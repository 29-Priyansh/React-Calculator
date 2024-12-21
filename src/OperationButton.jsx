import PropTypes from 'prop-types';
import { ACTIONS } from './Actions';

export default function OperationButton({ dispatch, operation }) {
    return <button onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })}>{operation}</button>
}

OperationButton.propTypes = {
    dispatch: PropTypes.func.isRequired,
    operation: PropTypes.string.isRequired
};