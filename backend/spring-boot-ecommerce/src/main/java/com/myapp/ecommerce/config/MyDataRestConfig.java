package com.myapp.ecommerce.config;

import com.myapp.ecommerce.entity.Product;
import com.myapp.ecommerce.entity.ProductCategory;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;

    @Autowired
    public MyDataRestConfig(EntityManager  theEntityManager) {
        entityManager = theEntityManager;
    }
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {

        HttpMethod[] theUnsupportedMethod = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE};

        config.getExposureConfiguration()
                .forDomainType(Product.class)
                .withItemExposure(((metadata, httpMethods) -> httpMethods.disable(theUnsupportedMethod)))
                .withCollectionExposure(((metdata, httpMethods) -> httpMethods.disable(theUnsupportedMethod)));

        config.getExposureConfiguration()
                .forDomainType(ProductCategory.class)
                .withItemExposure(((metadata, httpMethods) -> httpMethods.disable(theUnsupportedMethod)))
                .withCollectionExposure(((metadata, httpMethods) -> httpMethods.disable(theUnsupportedMethod)));


        // Par default les ids ne sont pas exposées sur les urls
        // Pour exposer les ids des objet de nos entities, afin d'avoir accée au IDS depuis nos app front
        //http://localhost:8080/api/product-category
        exposeIds(config);
    }

    private void exposeIds(RepositoryRestConfiguration configuration) {

        // Get a list of all entity classes from the entity manages
        Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

        //  Create an array of the entity type
        List<Class> entityClasses = new ArrayList<>();

        // get the entity type for the entities
        for (EntityType tempEntityType: entities) {
            entityClasses.add(tempEntityType.getJavaType());
        }

        // expose the entity IDS for the array of entity/domaine types
        Class[] domaineTypes = entityClasses.toArray(new Class[0]);
        configuration.exposeIdsFor(domaineTypes);
    }
}






