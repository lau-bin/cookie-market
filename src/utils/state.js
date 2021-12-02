import React, { createContext, useReducer } from 'react';

export const State = (initialState, prefix) => {
	let updatedState;
	const getState = () => updatedState;
	const store = createContext(initialState);
	const { Provider: InnerProvider } = store;

	const updateState = (state, newState, path = '') => { /// actua como reducer
		// console.log('updateState', state, path, newState) // debugging
		if (path.length === 0) {
			return { ...state, ...newState }; /// si no hay path agrega nueva propiedad al state y lo RETORNA
		}
		const pathArr = path.split('.');
		const first = pathArr[0]; ///propiedad a modificar
		state = { ...state }; /// nueva copia del estado
		if (!state[first]) {
			state[first] = {}; ///define nueva propiedad y le asigna objeto vacio 
		}
		if (pathArr.length === 1) { /// si la propiedad no tiene una subpropiedad, rellena la propiedad
			state[first] = !!newState && typeof newState === 'object' && !Array.isArray(newState) ? {
				...state[first],
				...newState
			} : newState;
		} else { ///rellena la propiedad con los datos viejos y repite el proceso de esta funcion con una propiedad interna
			state[first] = {
				...state[first],
				...updateState(state[first], newState, pathArr.slice(1).join('.'))
			};
		}

		return state;
	};

	const Provider = ({ children }) => {
		const [state, dispatch] = useReducer((state, payload) => {
			const { path, newState } = payload;
			if (path === undefined) {
				return state;
			}
			updatedState = updateState(state, newState, path);
			return updatedState;
		}, initialState);

		const update = (path, newState) => {
			dispatch({ path, newState });
		};
		const wrappedDispatch = (fn) => fn({ update, getState, dispatch: wrappedDispatch });

		return <InnerProvider value={{ update, state, dispatch: wrappedDispatch }}>{children}</InnerProvider>;
	};

	if (prefix) {
		return {
			[prefix + 'Store']: store,
			[prefix.substr(0, 1).toUpperCase() + prefix.substr(1) + 'Provider']: Provider,
		};
	}
    
	return { store, Provider };
};
