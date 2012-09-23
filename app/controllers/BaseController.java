package controllers;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.reflect.Modifier;
import java.lang.reflect.Type;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.google.gson.*;
import models.History;
import play.Play;
import play.mvc.Controller;

public class BaseController extends Controller {
    protected static Gson gson = initGson();

    private static Gson initGson() {
        GsonBuilder builder = new GsonBuilder();
        builder.setDateFormat(Play.configuration.getProperty("date.format"));
        //builder.setExclusionStrategies(new MyExclusionStrategy(null));

        builder.registerTypeAdapter(Date.class, new DateJsonSerializer());
        builder.registerTypeAdapter(Date.class, new DateJsonDeserializer());

        return builder.create();
    }

    private static class DateJsonSerializer implements JsonSerializer<Date> {
        @Override
        public JsonElement serialize(Date t, Type type, JsonSerializationContext jsonSerializationContext) {
            SimpleDateFormat format = new SimpleDateFormat("dd-MM-yyyy");
            String result = format.format(t).replace("-", "/");
            return new JsonPrimitive(result);
        }
    }

    private static class DateJsonDeserializer implements JsonDeserializer<Date> {
        @Override
        public Date deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context)
                throws JsonParseException {
            SimpleDateFormat format = new SimpleDateFormat("dd-MM-yyyy");
            String date = json.getAsJsonPrimitive().getAsString().replace("/", "-");
            try {
                if (!date.isEmpty()) {
                    return format.parse(date);
                } else {
                    return null;
                }
            } catch (ParseException e) {
                throw new RuntimeException(e);
            }
        }
    }

//    @Retention(RetentionPolicy.RUNTIME)
//    @Target({ElementType.FIELD})
//    public @interface Foo {
//        // Field tag only annotation
//    }
//
//    public static class MyExclusionStrategy implements ExclusionStrategy {
//        private final Class<?> typeToSkip;
//
//        private MyExclusionStrategy(Class<?> typeToSkip) {
//            this.typeToSkip = typeToSkip;
//        }
//
//        public boolean shouldSkipClass(Class<?> clazz) {
//            return (clazz == typeToSkip);
//        }
//
//        public boolean shouldSkipField(FieldAttributes f) {
//            return f.getAnnotation(Foo.class) != null;
//        }
//    }
}
