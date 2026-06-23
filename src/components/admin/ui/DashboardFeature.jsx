import React from 'react';
import PropTypes from 'prop-types';
import DashboardCard from './DashboardCard';

const DashboardFeature = ({ feature, content, activeLang, updateContent, t, index }) => {
  const f = content[activeLang].about.features[feature];
  const fields = ['title', 'desc'].map(k => ({
    labelKey: `admin.fields.p${k.charAt(0).toUpperCase() + k.slice(1)}`,
    value: f[k] || '',
    type: k === 'desc' ? 'textarea' : 'text',
    onChange: (v) => updateContent(activeLang, `about.features.${feature}.${k}`, v)
  }));
  return <DashboardCard title={`${t('admin.fields.feature')} ${index}`} fields={fields} t={t} />;
};

DashboardFeature.propTypes = {
  feature: PropTypes.string.isRequired,
  content: PropTypes.object.isRequired,
  activeLang: PropTypes.string.isRequired,
  updateContent: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired
};

export default DashboardFeature;
