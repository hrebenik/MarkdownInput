import React, {
  useRef,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from 'react';

import types from 'prop-types';
import cx from 'classnames';

import {
  Input,
  InputLabel,
  FormControl,
  FormHelperText,
  makeStyles,
} from '@material-ui/core';

import styles from 'assets/jss/material-dashboard-pro-react/components/customInputStyle';

import Render from 'components/Render/Render';
import Remark from 'components/Remark/Remark';

import genid from 'services/genid';
import { scalar } from 'constants/customTypes';

const useStyles = makeStyles(styles);
const useMarkdownStyles = makeStyles((theme) => ({
  root: {
    opacity: 1,
    fontSize: '14px',
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    fontWeight: '400',
    lineHeight: 1.42857,
    cursor: 'pointer',
    position: 'relative',
    paddingTop: '6px',
    '& > p': {
      marginBottom: '7px',
    },
    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      left: '0px',
      right: '0px',
      bottom: '0px',
      borderBottom: `1px solid ${theme.palette.grey[300]}`,
    },
    '&$error::after': {
      content: '""',
      display: 'block',
      position: 'absolute',
      left: '0px',
      right: '0px',
      bottom: '0px',
      borderBottom: `2px solid ${theme.palette.error.main}`,
    },
  },
  error: {},
}));
const useCustomStyles = makeStyles((theme) => ({
  noButtomMargin: {
    marginBottom: '0px',
  },
  fixMarginDense: {
    marginTop: '8px',
    marginBottom: '4px',
  },
  fixMarginDenseTopPadding: {
    paddingTop: '0px',
  },
  markdownFormControl: {
    '&::after': {
      top: '15px',
      right: '5px',
      width: '12px',
      color: 'white',
      height: '12px',
      content: '"m"',
      display: 'flex',
      fontSize: '12px',
      borderRadius: '50%',
      alignItems: 'center',
      position: 'absolute',
      fontFamily: 'monospace',
      justifyContent: 'center',
      backgroundColor: theme.palette.grey[300],
    },
  },
}));

const ids = [];

const MarkdownInput = (props) => {
  const {
    name,
    value,
    label,
    error,
    margin,
    success,
    onChange,
    inputRef,
    className,
    fullWidth,
    multiline,
    emptyHelper,
    defaultValue,
    id: customId,
    helperText: customHelperText,
  } = props;

  const classes = {
    ...useStyles(),
    ...useCustomStyles(),
  };
  const markdownClasses = useMarkdownStyles();
  const [focused, setFocused] = useState(false);
  const [currentValue, setCurrentValue] = useState(undefined);
  const [inited, setInited] = useState(false);
  const formRef = useRef(null);

  const helperText = emptyHelper && !customHelperText ? ' ' : customHelperText;
  const id = useMemo(() => customId || genid(ids, 'markdown-input-'), [customId]);

  const formHelperTextClasses = cx(
    helperText && error && classes.labelRootError,
    helperText && success && !error && classes.labelRootSuccess,
  );
  const inputLabelClasses = cx(
    label && classes.labelRoot,
    label && error && classes.labelRootError,
    label && success && !error && classes.labelRootSuccess,
  );
  const formControlClasses = cx(
    classes.formControl,
    classes.markdownFormControl,
    emptyHelper && classes.noButtomMargin,
    margin === 'dense' && classes.fixMarginDense,
    !label && margin === 'dense' && classes.fixMarginDenseTopPadding,
    className,
  );
  const inputUnderlineClasses = cx(
    classes.underline,
    error && classes.underlineError,
    success && !error && classes.underlineSuccess,
  );
  const markdownContainerClasses = cx(
    markdownClasses.root,
    error && !success && markdownClasses.error,
  );

  useEffect(() => {
    if (defaultValue && !currentValue && !inited) {
      setCurrentValue(defaultValue);
      setInited(true);
      return;
    }
    if (value) {
      setCurrentValue(value);
    }
  }, [value, defaultValue, setCurrentValue, currentValue, inited, setInited]);

  const handleFocus = useCallback(() => {
    setFocused(true);
  }, [setFocused]);

  const handleBlur = useCallback((e) => {
    if (!formRef.current.contains(e.relatedTarget)) {
      setFocused(false);
    }
  }, [setFocused]);

  const handleChange = useCallback((e, ...args) => {
    setCurrentValue(e.target.value);

    if (typeof onChange === 'function') {
      onChange(e, ...args);
    }
  }, [setCurrentValue, onChange]);

  return (
    <FormControl
      tabIndex="0"
      error={error}
      ref={formRef}
      onBlur={handleBlur}
      fullWidth={fullWidth}
      onFocus={handleFocus}
      className={formControlClasses}
      focused={focused || !!currentValue}
    >
      {/* LABEL */}
      {
        label && (
          <InputLabel
            htmlFor={id}
            className={inputLabelClasses}
          >
            {label}
          </InputLabel>
        )
      }

      {/* INPUT */}
      <Render when={focused || !currentValue}>
        <Input
          id={id}
          name={name}
          inputRef={inputRef}
          value={currentValue}
          multiline={multiline}
          onChange={handleChange}
          classes={{
            input: classes.input,
            underline: inputUnderlineClasses,
          }}
        />
      </Render>

      {/* MARKDOWN */}
      <Render when={!focused && currentValue}>
        <Remark className={markdownContainerClasses}>{currentValue}</Remark>
      </Render>

      {/* HELPER TEXT */}
      {
        helperText && (
          <FormHelperText
            component="div"
            className={formHelperTextClasses}
          >
            {helperText}
          </FormHelperText>
        )
      }
    </FormControl>
  );
};
MarkdownInput.propTypes = {
  id: scalar,
  name: types.string,
  value: types.string,
  label: types.string,
  error: types.bool,
  success: types.bool,
  onChange: types.func,
  fullWidth: types.bool,
  multiline: types.bool,
  emptyHelper: types.bool,
  className: types.string,
  helperText: types.node,
  defaultValue: types.string,
  margin: types.oneOf(['dense', 'none', 'normal']),
  inputRef: types.oneOfType([
    types.func,
    types.shape({
      current: types.node,
    }),
    types.node,
  ]),
};
MarkdownInput.defaultProps = {
  id: undefined,
  name: undefined,
  value: undefined,
  label: undefined,
  error: false,
  success: false,
  onChange: null,
  fullWidth: false,
  multiline: false,
  emptyHelper: false,
  margin: undefined,
  inputRef: undefined,
  className: undefined,
  helperText: undefined,
  defaultValue: undefined,
};

export default MarkdownInput;
