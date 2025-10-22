import { SettingsSchema } from "@/app/(authenticated)/despesas/schemas/settings-schema";
import api from "@/config/api";
import { Settings } from "@/interfaces/settings";
import { currencyToFloat } from "@/utils/parse-currency";

export const getSettings = async () => {
  const { data } = await api.get<Settings>("api/v1/settings");
  return data;
};

export const updateSettings = async (settings: SettingsSchema) => {
  const parsedSettings = {
    trialClassPrice: currencyToFloat(settings.trialClassPrice),
    teacherCommissionPerEnrollment: currencyToFloat(settings.teacherCommissionPerEnrollment),
    teacherCommissionPerTrialClass: currencyToFloat(settings.teacherCommissionPerTrialClass),
  };
  const { data } = await api.patch<Settings>("api/v1/settings", parsedSettings);
  return data;
};

