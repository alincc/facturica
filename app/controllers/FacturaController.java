package controllers;

import com.google.gson.*;
import play.db.jpa.JPA;
import play.mvc.*;
import play.Logger;

import models.*;
import sun.util.calendar.Gregorian;

import java.util.*;

public class FacturaController extends BaseController
{
    public static void list()
    {
        List<Factura> facturaList = Factura.find("order by docDate desc, client asc").fetch();
        renderJSON(facturaList);
    }

    public static void findById(Long id)
    {
        try
        {
            Factura factura = Factura.findById(id);
            if (factura == null)
            {
                response.status = Http.StatusCode.NOT_FOUND;
                return;
            }

            renderText(gson.toJson(factura));
        }
        catch (Exception ex)
        {
            response.status = Http.StatusCode.INTERNAL_ERROR;
        }
    }

    public static void create(JsonObject body)
    {
        Factura factura = null;

        try
        {
            factura = gson.fromJson(body, Factura.class);
            incrementSeries(factura, body.get("seriesId").getAsString());
        }
        catch (Exception ex)
        {
            Logger.error(ex, "Failed to parse JSON");
        }

        if (factura == null)
        {
            response.status = Http.StatusCode.NOT_FOUND;
            return;
        }

        try
        {
            // Validate and save
            if (factura.create())
            {
                // Update statistics
                addToStats(factura);

                response.status = Http.StatusCode.OK;
                renderJSON(factura);
            }
        }
        catch (Exception ex)
        {
            Logger.error(ex, "Cannot save model");
            response.status = Http.StatusCode.INTERNAL_ERROR;
        }
    }


    public static void update(Long id, JsonObject body)
    {
        Factura factura = null;

        try
        {
            // Deserialize
            factura = gson.fromJson(body, Factura.class);

            // Search prev factura
            Factura prev = Factura.findById(factura.id);

            if (prev != null)
            {
                // Remove factura from stats
                removeFromStats(prev);

                incrementSeries(factura, body.get("seriesId").getAsString());

                // Merge
                factura = factura.merge();

                // Try to validate and save
                if (factura.validateAndSave())
                {
                    addToStats(factura);
                }
                else
                {
                    throw new Exception("Factura not saved");
                }
            }
            else
            {
                response.status = Http.StatusCode.NOT_FOUND;
            }
        }
        catch (Exception ex)
        {
            Logger.error(ex, "Failed update record");
            response.status = Http.StatusCode.NOT_FOUND;
        }
    }

    public static void delete(Long id)
    {
        Factura factura = Factura.findById(id);
        notFoundIfNull(factura);

        removeFromStats(factura);
        factura.delete();
    }

    public static void stats()
    {
        List<FacturiMonthlyStats> stats = FacturiMonthlyStats.find("order by year desc, month desc").fetch(1);

        renderJSON(stats);
    }


    /**
     * Add factura to statistics
     *
     * @param factura
     */
    private static void addToStats(Factura factura)
    {
        FacturiMonthlyStats stats = getStat(factura);

        stats.vat += factura.vat;
        stats.subtotal += factura.subtotal;
        stats.total += factura.total;

        stats.save();
    }

    /**
     * Remove factura from statistics
     *
     * @param factura
     */
    private static void removeFromStats(Factura factura)
    {
        FacturiMonthlyStats stats = getStat(factura);

        stats.vat -= factura.vat;
        stats.subtotal -= factura.subtotal;
        stats.total -= factura.total;

        stats.save();
    }

    /**
     * Find stat line
     *
     * @param factura
     * @return
     */
    private static FacturiMonthlyStats getStat(Factura factura)
    {
        Date date = factura.docDate;
        Calendar c = GregorianCalendar.getInstance();
        c.setTime(date);

        int month = c.get(Calendar.MONTH) + 1;
        int year = c.get(Calendar.YEAR);

        FacturiMonthlyStats stats = FacturiMonthlyStats.find("byMonthAndYear", month, year).first();

        if (stats == null)
        {
            stats = new FacturiMonthlyStats();
            stats.month = month;
            stats.year = year;
        }
        return stats;
    }


    private static void incrementSeries(Factura factura, String seriesId)
    {
        try
        {
            //Series series = Series.find("byId",Long.getLong(seriesId)).first();
            Long id = Long.parseLong(seriesId);
            Series series = Series.findById(id);
            if (series != null)
            {
                factura.docNo = series.getNextSeries();
            }
        }
        catch (Exception ex)
        {
            Logger.error(ex, "Failed to increase series");
        }
    }

}
