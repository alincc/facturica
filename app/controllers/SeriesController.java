package controllers;

import com.google.gson.JsonObject;
import models.Client;
import models.Series;
import play.Logger;
import play.mvc.Http;

import java.util.List;

/**
 * User: alinc
 * Date: 4/26/12
 * Time: 8:35 PM
 */
public class SeriesController extends BaseController
{
    public static void list()
    {
        List<Series> list = Series.findAll();

        renderJSON(list);
    }

    public static void create(JsonObject body)
    {
        Series series = null;

        try
        {
            series = gson.fromJson(body, Series.class);
        }
        catch (Exception ex)
        {
            Logger.error(ex, "Failed to parse JSON");
        }

        if (series == null)
        {
            response.status = Http.StatusCode.NOT_FOUND;
            return;
        }

        try
        {
            series.validateAndCreate();
            response.status = Http.StatusCode.OK;
            renderJSON(series);
        }
        catch (Exception ex)
        {
            Logger.error(ex, "Cannot save model");
            response.status = Http.StatusCode.INTERNAL_ERROR;
        }
    }

    public static void update(Long id, JsonObject body)
    {
        Series series = null;

        try
        {
            series = gson.fromJson(body, Series.class);
            series = series.merge();
            series.save();

            response.status = Http.StatusCode.OK;
            renderJSON(series);
        }
        catch (Exception ex)
        {
            Logger.error(ex, "Failed update record");
            response.status = Http.StatusCode.NOT_FOUND;
        }
    }

    public static void delete(Long id)
    {
        Series series = Series.findById(id);
        notFoundIfNull(series);

        series.delete();
    }

    public static void findById(Long id)
    {
        try
        {
            Series series = Series.findById(id);
            if (series == null)
            {
                response.status = Http.StatusCode.NOT_FOUND;
                return;
            }
            renderJSON(series);
        }
        catch (Exception ex)
        {
            response.status = Http.StatusCode.INTERNAL_ERROR;
        }
    }

}
