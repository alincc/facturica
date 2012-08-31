package controllers;

import com.google.gson.JsonObject;
import models.Client;
import models.Factura;
import models.Partner;
import play.Logger;
import play.mvc.Http;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import java.util.ArrayList;
import java.util.List;

public class ClientsController extends BaseController
{
    public static void search(String query)
    {
        List<Client> partners = Client.find("byNameIlike", "%" + query + "%").fetch(10);
        renderJSON(partners);
    }

    public static void findById(Long id)
    {
        try
        {
            Client partner = Client.findById(id);
            if (partner == null)
            {
                response.status = Http.StatusCode.NOT_FOUND;
                return;
            }
            renderJSON(partner);
        }
        catch (Exception ex)
        {
            response.status = Http.StatusCode.INTERNAL_ERROR;
        }
    }

    public static void create(JsonObject body)
    {
        Client partner = null;

        try
        {
            partner = gson.fromJson(body, Client.class);
        }
        catch (Exception ex)
        {
            Logger.error(ex, "Failed to parse JSON");
        }

        if (partner == null)
        {
            response.status = Http.StatusCode.NOT_FOUND;
            return;
        }

        try
        {
            partner.validateAndCreate();
            response.status = Http.StatusCode.OK;
            renderJSON(partner);
        }
        catch (Exception ex)
        {
            Logger.error(ex, "Cannot save model");
            response.status = Http.StatusCode.INTERNAL_ERROR;
        }
    }

    public static void update(Long id, JsonObject body)
    {
        Client partner = null;

        try
        {
            partner = gson.fromJson(body, Client.class);
            partner = partner.merge();
            partner.save();

            response.status = Http.StatusCode.OK;
            renderJSON(partner);
        }
        catch (Exception ex)
        {
            Logger.error(ex, "Failed update record");
            response.status = Http.StatusCode.NOT_FOUND;
        }
    }

    public static void delete(Long id)
    {
        Client partner = Client.findById(id);
        notFoundIfNull(partner);

        partner.delete();
    }

    public static void list()
    {
        List<Client> partners = Client.findAll();
        renderJSON(partners);
    }
}
