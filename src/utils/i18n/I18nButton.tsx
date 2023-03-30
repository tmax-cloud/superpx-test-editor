import { Button } from '@mui/material';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

function I18nButton() {
  const { i18n } = useTranslation();
  const [languageState, setLanguageState] = React.useState('korean');
  const changeLanguage = () => {
    if (languageState === 'korean') {
      i18n.changeLanguage('en');
      setLanguageState('english');
    } else {
      i18n.changeLanguage('ko');
      setLanguageState('korean');
    }
  };

  return (
    <div>
      <Button onClick={() => changeLanguage()}>{languageState}</Button>
    </div>
  );
}

export default I18nButton;
