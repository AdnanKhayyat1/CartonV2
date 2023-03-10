import { supabase } from "../supabaseClient";

export const saveAsTemplate = async (id) => {
    try {
        const { error } = await supabase
        .from('pages')
        .update({ isTemplate: true })
        .eq('id', id)

      if (error) throw error;

      return true;
    } catch (error) {
      return false;
    }
  };
