/* MATERIAL UI */
// Components
import { makeStyles } from '@material-ui/core/styles';
import Switch from '@material-ui/core/Switch';
import Brightness4Icon from '@material-ui/icons/Brightness4';

const useStyles = makeStyles(() => ({
  darkModeToggle: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export default function DarkModeToggle(props: {
  darkMode: boolean;
  handleDarkMode: any;
}) {
  const { darkMode, handleDarkMode } = props;
  const classes = useStyles();
  return (
    <div className={classes.darkModeToggle}>
      <Brightness4Icon />
      <Switch
        checked={darkMode}
        onChange={(_) => handleDarkMode()}
        name="checkedA"
        inputProps={{ 'aria-label': 'secondary checkbox' }}
      />
    </div>
  );
}
