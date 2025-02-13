
alter table "public"."element_colors" 
add constraint "element_colors_theme_id_fkey" 
foreign key ("theme_id") 
references "public"."user_color_themes"("id") 
on delete cascade;
