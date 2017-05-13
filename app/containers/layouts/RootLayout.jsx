import { connect } from 'react-redux';
import RootLayout from 'layouts/RootLayout';

const mapStateToProps = (state) => ({
  appTheme: state.settings.appTheme,
})

export default connect(mapStateToProps)(RootLayout);
