import React from 'react';
import PropTypes from 'prop-types';
import DashboardField from './DashboardField';

const DashboardCard = ({ title, icon, fields, t }) => (
  <div className="p-10 rounded-[3.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl mb-12">
    <h4 className="text-sm font-black text-blue-600 uppercase tracking-[0.4em] mb-12 flex items-center gap-4">
      {icon && <span className="w-12 h-12 rounded-[1.2rem] bg-blue-600 text-white flex items-center justify-center text-lg">{icon}</span>}
      {title}
    </h4>
    {fields.map((f, i) => (
      <DashboardField
        key={i}
        label={t(f.labelKey)}
        value={f.value}
        type={f.type}
        onChange={f.onChange}
      />
    ))}
  </div>
);

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node,
  fields: PropTypes.arrayOf(PropTypes.shape({
    labelKey: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    type: PropTypes.string
  })).isRequired,
  t: PropTypes.func.isRequired
};

export default DashboardCard;
