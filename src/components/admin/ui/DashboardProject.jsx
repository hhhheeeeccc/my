import React from 'react';
import PropTypes from 'prop-types';
import DashboardCard from './DashboardCard';

const DashboardProject = ({ index, content, activeLang, updateContent, t }) => {
  const p = content[activeLang].projects[`project${index}`];
  const fields = ['title', 'description'].map(k => ({
    labelKey: `admin.fields.p${k.charAt(0).toUpperCase() + (k === 'description' ? 'Desc' : 'Title')}`,
    value: p[k] || '',
    type: k === 'description' ? 'textarea' : 'text',
    onChange: (v) => updateContent(activeLang, `projects.project${index}.${k}`, v)
  }));
  return <DashboardCard title={t(`admin.fields.project${index}`)} icon={`0${index}`} fields={fields} t={t} />;
};

DashboardProject.propTypes = {
  index: PropTypes.number.isRequired,
  content: PropTypes.object.isRequired,
  activeLang: PropTypes.string.isRequired,
  updateContent: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired
};

export default DashboardProject;
